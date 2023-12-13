// Try to delete the whole folder in Storage, but still failed
// Error: Class extends value undefined is not a constructor or null firebase admin

import * as admin from 'firebase-admin'

const bucketName = 'skirunmap.appspot.com'

export const deleteStorageFolder = async (folderPath: string) => {
  const bucket = admin.storage().bucket(bucketName)
  try {
    await bucket.deleteFiles({ prefix: folderPath })
  } catch (error) {
    console.error(`Error occurred while deleting the folder: ${folderPath}`, error)
  }
}
