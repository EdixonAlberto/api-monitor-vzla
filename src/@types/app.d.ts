type TPrice = {
  amount: number
  chg: {
    amount: number
    percentage: string
    trend: string
  }
  source: string
  timestamp: Date
}

type OCRSpaceResponse = {
  ParsedResults: [
    {
      TextOverlay: object,
      TextOrientation: string,
      FileParseExitCode: number,
      /* ParsedText:
        'Odolartoday\r\n' +
        'TRM PesosCOL/ BsS. 1,00\r\n' +
        'Mayo 14, 2022 08:21 PM\r\n' +
        'S dolar\r\n' +
        '4,75\r\n' +
        '4 , 78\r\n' +
        '€1,CO = USD $1,13CO\r\n' +
        '*DOLARTODAY BsS. 4,75\r\n' +
        'BCV BsS. 4,56\r\n' +
        'DOLAR BsS. 5,19\r\n' +
        '€ euro\r\n' +
        'BsS. 5,37\r\n' +
        'BsS. 5,15\r\n' +
        'BsS. 5,86\r\n' +
        '( • ) DOLAN TODAY = Valor aprox del paralelo en Ia ciudad da Caracas\r\n' +
        'C • ) DOLAR BCV = Promedio ponderadoin\r\n' +
        'ciones bancarias\r\n' +
        'C • • ) CUCUTA = Cambio fronterizo / dolar C UTA (operaciones en efectivo)\r\n' +
        '0 2022 DolarToda.com/@ larToday en Twitter\r\n',
      */
      ParsedText: string
      ErrorMessage: string,
      ErrorDetails: string
    }
  ],
  OCRExitCode: number,
  IsErroredOnProcessing: boolean,
  ProcessingTimeInMilliseconds: string,
  SearchablePDFURL: string
}
