import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import '../styles/QRScanner.css';

export default function QRScanner({ onScanSuccess, onClose }) {
  const [scanning, setScanning] = useState(true);
  const [error, setError] = useState('');
  const scannerRef = useRef(null);
  const qrScannerRef = useRef(null);

  useEffect(() => {
    if (!scannerRef.current) return;

    const scanner = new Html5QrcodeScanner(
      scannerRef.current.id,
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        facingMode: 'environment',
      },
      true
    );

    const onScannerSuccess = (decodedText, decodedResult) => {
      scanner.clear();
      setScanning(false);
      onScanSuccess(decodedText);
    };

    const onScannerError = (errorMessage) => {
      // Ignorar errores de lectura normal
      if (!errorMessage.includes('No QR code found')) {
        console.log(errorMessage);
      }
    };

    try {
      scanner.render(onScannerSuccess, onScannerError);
      qrScannerRef.current = scanner;
    } catch (err) {
      setError('No se pudo acceder a la cámara. Verifica los permisos.');
      setScanning(false);
    }

    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.clear().catch(() => {});
      }
    };
  }, [onScanSuccess]);

  const handleClose = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.clear().catch(() => {});
    }
    onClose();
  };

  return (
    <div className="qr-scanner">
      {error ? (
        <div className="scanner-error">
          <p>{error}</p>
          <button onClick={handleClose} className="btn-close">
            Cerrar
          </button>
        </div>
      ) : (
        <>
          <div id="qr-scanner" ref={scannerRef} className="scanner-container"></div>
          {scanning && (
            <button onClick={handleClose} className="btn-cancel-scan">
              Cancelar escaneo
            </button>
          )}
        </>
      )}
    </div>
  );
}
