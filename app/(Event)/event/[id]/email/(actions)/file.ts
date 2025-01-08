'use server'

import { v2 as cloud, UploadApiResponse } from 'cloudinary'

cloud.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export async function uploadFile(
  data: FormData,
  eventID: string,
): Promise<UploadApiResponse | undefined> {
  const file = data.get('file') as File
  if (file.type.startsWith('image')) {
    const buffer = Buffer.from(await file.arrayBuffer())
    return new Promise((resolve, reject) => {
      cloud.uploader
        .upload_stream({ folder: `edm-images_${eventID}` }, (error, result) => {
          if (error) {
            reject(error)
          } else {
            resolve(result)
          }
        })
        .end(buffer)
    })
  }
}

export async function readAllImages(eventID: string) {
  try {
    const { resources } = (await cloud.api.resources({
      prefix: `edm-images_${eventID}`,
      resource_type: 'image',
      type: 'upload',
    })) as { resources: UploadApiResponse[] }

    return resources.map(({ secure_url }) => secure_url)
  } catch (error) {
    console.log(error)
  }

  return []
}

export async function deleteImage(url: string) {
  const publicID = url.split('/').slice(-2).join('/').split('.')[0]

  try {
    await cloud.uploader.destroy(publicID as string)
  } catch (error) {
    console.log(error)
  }
}
