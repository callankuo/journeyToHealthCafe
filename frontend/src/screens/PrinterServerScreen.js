import React from 'react'
import usePrinter from '../components/usePrinter'
import { PRINTER_DRIVER_PATH} from '../constants/configConstants'
import {Button} from 'react-bootstrap'
const PrinterServerScreen = () => {

    usePrinter(PRINTER_DRIVER_PATH)

    
    const printerHandler = () => {

        console.log('print')
    }
    
    

    return (
        <>
        <p>Staring up print server</p>
        <Button type='button' className='btn-block'
            disabled={false} 
            onClick={printerHandler(window.epson)} >
            Connect Print Server
        </Button>
            
        </>
    )

}
export default PrinterServerScreen
