import React, { useEffect } from 'react';
import { PRINTER_ID, PRINTER_IP_ADDRESS, PRINTER_PORT} from '../constants/configConstants'

const usePrinter = (scriptUrl) => {

  console.log('scriptUrl = '+ scriptUrl)
  useEffect(() => {
    console.log('useEffect = ')
    const script = document.createElement('script');
    script.src = scriptUrl;
    //script.async = true;
    document.body.appendChild(script);
    console.log('document.body = ' +script)

    if (window.epson) {
    var ePosDev = new window.epson.ePOSDevice();
    var printer = null;

        function connect() {

        var ipAddress = PRINTER_IP_ADDRESS 
        var port = PRINTER_PORT

        ePosDev.connect(ipAddress, port, callback_connect); 
        }

        function callback_connect(resultConnect){
          var deviceId = PRINTER_ID;
          var options = {'crypto' : false, 'buffer' : false};
          if ((resultConnect === 'OK') || (resultConnect === 'SSL_CONNECT_OK')) {
            //Retrieves the Printer object
            ePosDev.createDevice(deviceId, ePosDev.DEVICE_TYPE_PRINTER, options, callback_createDevice);
          }
          else {
            console.log('connect result = ' + resultConnect)
          } }

          function callback_createDevice(deviceObj, errorCode){ 
              if (deviceObj === null) {
            //Displays an error message if the system fails to retrieve the Printer object
              console.error('system fails to retrieve the Printer object' +errorCode)
               return; }
            printer = deviceObj;
          //Registers the print complete event
          printer.onreceive = function(response){ if (response.success) {
            //Displays the successful print message
              console.log('print response success!')
          }
          else {
            console.log('print response fail')//Displays error messages
          } };
      }

      connect();
    } else {console.log("window.epson === null")}

  return () => {
      document.body.removeChild(script);
  }
  }, [scriptUrl]);
};
export default usePrinter;
