import { useCallback, useState } from "react";
import { useUploadPhotosMutation } from "../redux/api/galleryApi";
import { getApiErrorMessage } from "../utils/apiError";

// Backend (POST /editorial_system/photos/) odmítá requesty s víc než 60 soubory
// najednou (DATA_UPLOAD_MAX_NUMBER_FILES). 40 je bezpečná rezerva pod tím limitem,
// ať zbyde prostor i pro velké mobilní fotky v dávce.
const BATCH_SIZE = 40;

function chunk(items, size) {
  const batches = [];
  for (let i = 0; i < items.length; i += size) {
    batches.push(items.slice(i, i + size));
  }
  return batches;
}

// Rozseká libovolně velký výběr souborů na dávky po BATCH_SIZE a posílá je
// sekvenčně (ne Promise.all) - souběžné velké requesty by si na backendu
// navzájem braly gunicorn workery. Když jedna dávka selže (400/502), zbylé
// dávky se pořád zkusí odeslat - backend v rámci dávky nezahazuje už úspěšně
// nahrané fotky, takže i částečně úspěšná dávka má smysl.
export function useBatchPhotoUpload() {
  const [uploadPhotosBatch] = useUploadPhotosMutation();
  const [progress, setProgress] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const uploadInBatches = useCallback(
    async ({ category, files, altTextI18n }) => {
      const batches = chunk(files, BATCH_SIZE);
      const uploaded = [];
      const errors = [];

      setIsUploading(true);
      try {
        for (let i = 0; i < batches.length; i++) {
          setProgress({
            batch: i + 1,
            totalBatches: batches.length,
            uploadedSoFar: uploaded.length,
            totalFiles: files.length,
          });

          try {
            const result = await uploadPhotosBatch({
              category,
              files: batches[i],
              altTextI18n,
            }).unwrap();
            uploaded.push(...(Array.isArray(result) ? result : [result]));
          } catch (err) {
            errors.push({
              batchIndex: i,
              fileCount: batches[i].length,
              message: getApiErrorMessage(err, "Nahrávání dávky selhalo"),
            });
          }
        }
      } finally {
        setIsUploading(false);
        setProgress(null);
      }

      return { uploaded, errors };
    },
    [uploadPhotosBatch],
  );

  return { uploadInBatches, isUploading, progress };
}
