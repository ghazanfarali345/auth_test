import { diskStorage } from 'multer';
import { extname } from 'path';
import { IGetUserAuthInfoRequest } from 'src/interfaces';

export const multerConfig = {
  dest: './images',
  storage: diskStorage({
    destination: (req, file, cb) => {
      cb(null, './images');
    },
    filename: (req, file, cb) => {
      const randomName = Array(32)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
      cb(null, `${randomName}${extname(file.originalname)}`);
    },
  }),
};
export const storage = {
  storage: diskStorage({
    destination: './images',
    filename: (req: IGetUserAuthInfoRequest, file, cb) => {
      console.log({ file }, 'storage');
      const filename: string = req?.user._id + '123';
      const extension: string = extname(file.originalname);

      cb(null, `${filename}${extension}`);
    },
  }),
};
