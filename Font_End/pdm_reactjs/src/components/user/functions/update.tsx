import React, { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";

declare const html2pdf: any;

const Update: React.FC = () => {
    const [fileId, setFileId] = useState<number | null>(null);
    const { file_id } = useParams<{ file_id: string }>();

    useEffect(() => {
        if (file_id) {
            setFileId(parseInt(file_id, 10));
        }
    }, [file_id]);

    const contentRef = useRef<HTMLDivElement>(null);
    const filenameRef = useRef<HTMLInputElement>(null);
    const showCodeRef = useRef<HTMLButtonElement>(null);

    const fetchFileData = async (file_id: number) => {
        try {
            const response = await fetch(`https://localhost:7227/api/File/read/${file_id}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const contentType = response.headers.get('content-type');
            const data = await response.text();
            const content = contentRef.current;
          
            if (contentType && (contentType.startsWith('text/') || contentType.includes('json') || contentType.includes('xml'))) {
                const decodedText = decodeURIComponent(escape(window.atob(data)));
                if (content) content.innerHTML = decodedText;
            } else if (contentType && contentType === 'application/pdf') {
                const pdfData = atob(data);
                const loadingTask = pdfjsLib.getDocument({ data: pdfData });
                loadingTask.promise.then((pdf) => {
                    pdf.getPage(1).then((page) => {
                        const scale = 1.5;
                        const viewport = page.getViewport({ scale });

                        const canvas = document.createElement('canvas');
                        const context = canvas.getContext('2d');
                        if (!context) {
                            throw new Error('Failed to get canvas context');
                        }
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;

                        if (content) {
                            content.innerHTML = '';
                            content.appendChild(canvas);
                        }

                        const renderContext = {
                            canvasContext: context,
                            viewport: viewport,
                        };
                        page.render(renderContext);
                    });
                });
            } else if (contentType && contentType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                const arrayBuffer = Uint8Array.from(atob(data), c => c.charCodeAt(0)).buffer;
                mammoth.convertToHtml({ arrayBuffer: arrayBuffer })
                    .then((result) => {
                        if (content) content.innerHTML = result.value;
                    })
                    .catch((error) => {
                        console.error('Error converting DOCX to HTML:', error);
                    });
            }
        } catch (error) {
            console.error('Error fetching file data:', error);
        }
    };
    console.log(fetchFileData);
    useEffect(() => {
        if (fileId !== null) {
            fetchFileData(fileId);
        }
    }, [fileId]);

    const formatDoc = (cmd: string, value?: string) => {
        document.execCommand(cmd, false, value);
    };

    const addLink = () => {
        const url = prompt("Enter the link here: ", "http://");
        if (url) {
            formatDoc("createLink", url);
        }
    };

    const fileHandle = (value: string) => {
        const content = contentRef.current;
        const filename = filenameRef.current?.value || 'untitled';

        if (content) {
            if (value === 'new') {
                content.innerHTML = '';
                if (filenameRef.current) filenameRef.current.value = 'untitled';
            } else if (value === 'txt') {
                const blob = new Blob([content.innerText]);
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${filename}.txt`;
                link.click();
                URL.revokeObjectURL(url);
            } else if (value === 'pdf') {
                html2pdf().from(content).save(filename);
            }
        }
    };

    return (
        <div className='content'>
            <div className="container">
                <div className="toolbar">
                    <div className="head">
                        <input type="text" placeholder="Filename" defaultValue="untitled" id="filename" ref={filenameRef} />
                        <select onChange={(e) => fileHandle(e.target.value)} defaultValue="">
                            <option value="" hidden disabled>File</option>
                            <option value="new">New file</option>
                            <option value="txt">Save as txt</option>
                            <option value="pdf">Save as pdf</option>
                        </select>
                        <select onChange={(e) => formatDoc('formatBlock', e.target.value)} defaultValue="">
                            <option value="" hidden disabled>Format</option>
                            <option value="h1">Heading 1</option>
                            <option value="h2">Heading 2</option>
                            <option value="h3">Heading 3</option>
                            <option value="h4">Heading 4</option>
                            <option value="h5">Heading 5</option>
                            <option value="h6">Heading 6</option>
                            <option value="p">Paragraph</option>
                        </select>
                        <select onChange={(e) => formatDoc('fontSize', e.target.value)} defaultValue="">
                            <option value="" hidden disabled>Font size</option>
                            <option value={1}>Extra small</option>
                            <option value={2}>Small</option>
                            <option value={3}>Regular</option>
                            <option value={4}>Medium</option>
                            <option value={5}>Large</option>
                            <option value={6}>Extra Large</option>
                            <option value={7}>Big</option>
                        </select>
                        <div className="color">
                            <span>Color</span>
                            <input type="color" onInput={(e) => formatDoc('foreColor', e.currentTarget.value)} defaultValue="#000000" />
                        </div>
                        <div className="color">
                            <span>Background</span>
                            <input type="color" onInput={(e) => formatDoc('hiliteColor', e.currentTarget.value)} defaultValue="#000000" />
                        </div>
                    </div>
                    <div className="btn-toolbar">
                        <button onClick={() => formatDoc('undo')}><i className="bx bx-undo" /></button>
                        <button onClick={() => formatDoc('redo')}><i className="bx bx-redo" /></button>
                        <button onClick={() => formatDoc('bold')}><i className="bx bx-bold" /></button>
                        <button onClick={() => formatDoc('underline')}><i className="bx bx-underline" /></button>
                        <button onClick={() => formatDoc('italic')}><i className="bx bx-italic" /></button>
                        <button onClick={() => formatDoc('strikeThrough')}><i className="bx bx-strikethrough" /></button>
                        <button onClick={() => formatDoc('justifyLeft')}><i className="bx bx-align-left" /></button>
                        <button onClick={() => formatDoc('justifyCenter')}><i className="bx bx-align-middle" /></button>
                        <button onClick={() => formatDoc('justifyRight')}><i className="bx bx-align-right" /></button>
                        <button onClick={() => formatDoc('justifyFull')}><i className="bx bx-align-justify" /></button>
                        <button onClick={() => formatDoc('insertOrderedList')}><i className="bx bx-list-ol" /></button>
                        <button onClick={() => formatDoc('insertUnorderedList')}><i className="bx bx-list-ul" /></button>
                        <button onClick={addLink}><i className="bx bx-link" /></button>
                        <button onClick={() => formatDoc('unlink')}><i className="bx bx-unlink" /></button>
                        <button id="show-code" data-active="false" ref={showCodeRef}>&lt;/&gt;</button>
                    </div>
                </div>
                <div id="content" contentEditable="true" spellCheck="false" ref={contentRef}>
                    {/* File content goes here */}
                </div>
            </div>
        </div>
    );
};

export default Update;
