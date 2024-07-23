"use client";

import Image from "next/image";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {cn, convertFileToUrl} from "@/lib/utils";

type FileUploaderProps = {
    files: File[] | undefined;
    onChange: (files: File[]) => void;
};

export const FileUploader = ({ files, onChange }: FileUploaderProps) => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        onChange(acceptedFiles);
    }, []);

    const theme = true;
    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <div {...getRootProps()} className="file-upload border text-center p-4 cursor-pointer">
            <input {...getInputProps()} />
            {files && files?.length > 0 ? (
                <Image
                    src={convertFileToUrl(files[0])}
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
                        className={cn({ 'brightness-[10] invert-0': theme })}
                    />
                    <div className="file-upload_label">
                        <p className={`text-xs`}><span>Click to upload </span> or drag and drop</p>
                        <p className={`text-sm`}>SVG, PNG, JPG or GIF (max. 800x400px)</p>
                    </div>
                </>
            )}
        </div>
    );
};