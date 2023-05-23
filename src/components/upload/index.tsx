import { baseBackendUrl } from '@pages/_app';
import { Api, useApi } from '@src/api';
import { Upload, Progress } from 'antd';
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile as UploadFileType } from 'antd/es/upload/interface';
import { useEffect, useState } from 'react';

export type FileResponse = {
  name: string;
  uploadPath: string;
};

export const UploadFile = ({
  onSuccess: onSuccessEvent,
  onError: onErrorEvent,
  defaultFile,
}: {
  onSuccess?: Function;
  onError?: Function;
  defaultFile?: string;
}) => {
  const api: Api = useApi();
  const [progress, setProgress] = useState(0);
  const [fileList, setFileList] = useState<UploadFileType[]>([]);

  useEffect(() => {
    if (fileList.length === 0 && onSuccessEvent) onSuccessEvent(null);
  }, [fileList.length]);

  useEffect(() => {
    setFileList(
      defaultFile
        ? [
            {
              uid: '1',
              name: 'rasm',
              status: 'done',
              url: `${baseBackendUrl}${defaultFile}`,
            },
          ]
        : [],
    );
    if (onSuccessEvent) onSuccessEvent(defaultFile ? { name: '', uploadPath: 'public/' + defaultFile } : null);
  }, [defaultFile]);

  const uploadImage = async (options: any) => {
    const { onSuccess, onError, file, onProgress } = options;

    const fmData = new FormData();
    const config = {
      headers: { 'content-type': 'multipart/form-data' },
      onUploadProgress: (event: any) => {
        const percent = Math.floor((event.loaded / event.total) * 100);
        setProgress(percent);
        if (percent === 100) {
          setTimeout(() => setProgress(0), 1000);
        }
        onProgress({ percent: (event.loaded / event.total) * 100 });
      },
    };
    fmData.append('file', file);
    try {
      // @ts-ignore
      const res = await api.instance.post(`${baseBackendUrl}api/upload`, fmData, { config });

      onSuccess('Ok');
      // console.log('server res: ', res);
      if (onSuccessEvent) onSuccessEvent(res?.data || {});
    } catch (err) {
      // console.log('Eroor: ', err);
      const error = new Error('Some error');
      onError({ err });
      if (onErrorEvent) onErrorEvent({ err } || { err: 'Error' });
    }
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (onSuccessEvent && newFileList.length === 0) onSuccessEvent(null);
  };

  return (
    <div>
      <Upload
        accept="image/*"
        customRequest={uploadImage}
        listType="picture-card"
        onChange={handleChange}
        fileList={fileList}
      >
        {fileList.length == 0 && <div>Yuklash</div>}
      </Upload>
      {progress > 0 ? <Progress percent={progress} /> : null}
    </div>
  );
};
