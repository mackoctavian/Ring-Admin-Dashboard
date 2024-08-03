"use client";

import Image from "next/image";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { cn, convertFileToUrl } from "@/lib/utils";

type FileUploaderProps = {
    files: File[] | string | undefined;
    onChange: (files: File[]) => void;
};

export const FileUploader = ({ files, onChange }: FileUploaderProps) => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        onChange(acceptedFiles);
    }, []);

    const theme = true;
    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    const getImageSrc = () => {
        if (typeof files === 'string') {
            return files;
        }
        if (Array.isArray(files) && files.length > 0) {
            return convertFileToUrl(files[0]);
        }
        return '';
    };

    const imageSrc = getImageSrc();

    return (
        <div {...getRootProps()} className="file-upload border text-center p-4 cursor-pointer">
            <input {...getInputProps()} />
            {imageSrc ? (
                <Image
                    src={imageSrc}
                    width={1000}
                    height={1000}
                    alt="Uploaded file"
                    className="max-h-[400px] overflow-hidden object-cover"
                />
            ) : (
                <>
                    <Image
                        src="/icons/icons/upload.svg"
                        width={40}
                        height={40}
                        alt="upload"
                        className={cn({ 'brightness-[10] invert-0 m-auto mb-2 text-center': theme })}
                    />
                    <div className="file-upload_label">
                        <p className={`text-xs`}><span>Click to upload </span> or drag and drop</p>
                        <p className={`text-sm`}>PNG, JPG or GIF (max. 800x400px)</p>
                    </div>
                </>
            )}
        </div>
    );
};