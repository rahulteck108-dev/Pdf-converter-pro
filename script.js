document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const fileList = document.getElementById('file-list');
    const convertBtn = document.getElementById('convert-btn');
    const statusMsg = document.getElementById('status');
    const toolBtns = document.querySelectorAll('.tool-btn');

    let currentTool = 'image-to-pdf';
    let selectedFiles = [];

    // Tool Selection
    toolBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            toolBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentTool = btn.dataset.tool;
            
            // Reset files when switching tools
            selectedFiles = [];
            updateFileList();
            
            // Update accepted file types
            if (currentTool === 'image-to-pdf') {
                fileInput.accept = 'image/*';
            } else {
                fileInput.accept = '.pdf';
            }
        });
    });

    // Drag & Drop Handlers
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.add('dragover');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.remove('dragover');
        }, false);
    });

    dropZone.addEventListener('drop', (e) => {
        const files = e.dataTransfer.files;
        handleFiles(files);
    }, false);

    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    function handleFiles(files) {
        Array.from(files).forEach(file => {
            if (currentTool === 'image-to-pdf' && !file.type.startsWith('image/')) {
                showStatus('Please upload image files for Image to PDF tool.', 'error');
                return;
            }
            if (currentTool === 'merge-pdf' && file.type !== 'application/pdf') {
                showStatus('Please upload PDF files for Merge PDF tool.', 'error');
                return;
            }
            selectedFiles.push(file);
        });
        updateFileList();
        statusMsg.textContent = '';
    }

    function updateFileList() {
        fileList.innerHTML = '';
        selectedFiles.forEach((file, index) => {
            const div = document.createElement('div');
            div.className = 'file-item';
            div.innerHTML = `
                <span>${file.name}</span>
                <button class="file-remove" onclick="removeFile(${index})">×</button>
            `;
            fileList.appendChild(div);
        });
        
        convertBtn.disabled = selectedFiles.length === 0 || (currentTool === 'merge-pdf' && selectedFiles.length < 2);
    }

    window.removeFile = (index) => {
        selectedFiles.splice(index, 1);
        updateFileList();
    };

    function showStatus(msg, type) {
        statusMsg.textContent = msg;
        statusMsg.className = `status-message status-${type}`;
    }

    convertBtn.addEventListener('click', async () => {
        if (selectedFiles.length === 0) return;

        showStatus('Processing...', 'loading');
        convertBtn.disabled = true;

        try {
            if (currentTool === 'image-to-pdf') {
                await convertImagesToPdf();
            } else if (currentTool === 'merge-pdf') {
                await mergePdfs();
            }
            showStatus('Conversion successful! Downloading...', 'success');
        } catch (error) {
            console.error(error);
            showStatus('An error occurred during conversion.', 'error');
        } finally {
            convertBtn.disabled = false;
        }
    });

    async function convertImagesToPdf() {
        const { PDFDocument } = PDFLib;
        const pdfDoc = await PDFDocument.create();

        for (const file of selectedFiles) {
            const arrayBuffer = await file.arrayBuffer();
            let image;
            
            if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
                image = await pdfDoc.embedJpg(arrayBuffer);
            } else if (file.type === 'image/png') {
                image = await pdfDoc.embedPng(arrayBuffer);
            } else {
                throw new Error('Unsupported image format');
            }

            // A4 page size in points (595.28 x 841.89)
            const a4Width = 595.28;
            const a4Height = 841.89;
            const page = pdfDoc.addPage([a4Width, a4Height]);
            
            // Calculate scale to fit image within A4 bounds, keeping aspect ratio
            const scale = Math.min(
                a4Width / image.width,
                a4Height / image.height
            );
            
            const scaledWidth = image.width * scale;
            const scaledHeight = image.height * scale;
            
            // Center image on page
            const x = (a4Width - scaledWidth) / 2;
            const y = (a4Height - scaledHeight) / 2;

            page.drawImage(image, {
                x: x,
                y: y,
                width: scaledWidth,
                height: scaledHeight,
            });
        }

        const pdfBytes = await pdfDoc.save();
        downloadFile(pdfBytes, 'converted.pdf', 'application/pdf');
    }

    async function mergePdfs() {
        const { PDFDocument } = PDFLib;
        const mergedPdf = await PDFDocument.create();

        for (const file of selectedFiles) {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await PDFDocument.load(arrayBuffer);
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach((page) => mergedPdf.addPage(page));
        }

        const pdfBytes = await mergedPdf.save();
        downloadFile(pdfBytes, 'merged.pdf', 'application/pdf');
    }

    function downloadFile(bytes, filename, type) {
        const blob = new Blob([bytes], { type: type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 100);
    }
});
