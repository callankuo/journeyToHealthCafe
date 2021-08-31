import React, { useState } from 'react'
import QRCode from 'qrcode.react';
import { ListGroup, Row, Col, ListGroupItem } from 'react-bootstrap';

const QRCodeScreen = () => {

    const [inputText, setInputText] = useState('');
    const [qrCodeText, setQRCodeText] = useState('');

    // generate QR code
  const generateQRCode = () => {
    setQRCodeText(inputText);
  }

  // download QR code
  const downloadQRCode = () => {
    const qrCodeURL = document.getElementById('qrCodeEl')
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    console.log(qrCodeURL)
    let aEl = document.createElement("a");
    aEl.href = qrCodeURL;
    aEl.download = "QR_Code.png";
    document.body.appendChild(aEl);
    aEl.click();
    document.body.removeChild(aEl);
  }

    return (
      <ListGroup variant='flush'>
        <ListGroup.Item>
            <h3>Generate and download a QR code image</h3>
        </ListGroup.Item>
        <ListGroup.Item>
              
                <textarea
                    className="form-control"
                    row='3'
                    placeholder="Enter input"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                />
        </ListGroup.Item>
        <ListGroup.Item>
                <input
                    type="button"
                    value="Generate"
                    onClick={generateQRCode}
                />
            </ListGroup.Item>
            <ListGroup.Item>
            <QRCode
                id="qrCodeEl"
                size={150}
                value={qrCodeText}
            />
            </ListGroup.Item>
            <ListGroup.Item>
            <input
                type="button"
                className="download-btn"
                value="Download"
                onClick={downloadQRCode}
            />
            </ListGroup.Item>
        </ListGroup>
    )
}

export default QRCodeScreen
