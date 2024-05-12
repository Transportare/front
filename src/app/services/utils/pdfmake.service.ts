import { Injectable } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as jsBarcode from 'JsBarcode';
import * as moment from 'moment';
import { Cargo, Manifiesto } from '@models/index';

@Injectable({ providedIn: 'root' })
export class PdfMakeService {
    constructor() {}

    private generarCodigoBarra(codigo) {
        const canvas = document.createElement('canvas');
        const opts: jsBarcode.Options = { fontSize: 28, height: 70 };
        jsBarcode(canvas, codigo, opts);
        return canvas.toDataURL();
    }

    private generarTicketRuta(data: Cargo) {
        const paquetes = [];

        for (let i = 1; i <= Number(data.paquete.cantidad); i++) {
            const element = {
                pageBreak: 'before',
                table: {
                    widths: ['auto', 120, 100],
                    body: [
                        [
                            {
                                text: `${data.remitente.sucursal}`,
                                bold: true,
                                fontSize: 18,
                                borderColor: ['#000000', '#000000', '#ffffff', '#000000'],
                            },
                            {},
                            {
                                text: `${data.destinatario.sucursal}`,
                                bold: true,
                                fontSize: 18,
                                alignment: 'right',
                                borderColor: ['#ffffff', '#000000', '#000000', '#000000'],
                            },
                        ],
                        [
                            { text: 'MV', bold: true },
                            { text: `Peso (Kg.): ${data.paquete.peso}`, bold: true },
                            { text: `Piezas: ${i} de ${data.paquete.cantidad}`, bold: true },
                        ],
                        [
                            {
                                text: 'REMITENTE',
                                fillColor: 'black',
                                color: '#fff',
                                bold: true,
                                colSpan: 3,
                                alignment: 'center',
                            },
                        ],
                        [{ text: `${data.remitente.nombres} ${data.remitente.apellidos}`, colSpan: 3 }],
                        [
                            {
                                text: 'DIRECCIÓN:',
                                bold: true,
                                borderColor: ['#000000', '#ffffff', '#ffffff', '#ffffff'],
                            },
                            {
                                text: `${data.remitente.direccion || '-'}`,
                                colSpan: 2,
                                borderColor: ['#ffffff', '#ffffff', '#000000', '#ffffff'],
                            },
                        ],
                        [
                            {
                                text: 'LOCALIDAD:',
                                bold: true,
                                borderColor: ['#000000', '#ffffff', '#ffffff', '#000000'],
                            },
                            {
                                text: `${data.remitente.localidad}`,
                                colSpan: 2,
                                borderColor: ['#ffffff', '#ffffff', '#000000', '#000000'],
                            },
                        ],
                        [
                            {
                                image: 'barcode',
                                width: 200,
                                alignment: 'center',
                                colSpan: 3,
                                borderColor: ['#000000', '#ffffff', '#000000', '#ffffff'],
                            },
                        ],
                        [
                            {
                                text: `${data.paquete.pago === 1 ? 'PAGO CONTRAENTREGA' : ''}`,
                                bold: true,
                                fontSize: 16,
                                borderColor: ['#000000', '#ffffff', '#000000', '#000000'],
                                colSpan: 3,
                            },
                        ],
                        [
                            {
                                text: 'DESTINATARIO',
                                fillColor: 'black',
                                color: '#fff',
                                bold: true,
                                colSpan: 3,
                                alignment: 'center',
                            },
                        ],
                        [{ text: `${data.destinatario.nombres} ${data.destinatario.apellidos}`, colSpan: 3 }],
                        [
                            {
                                text: 'DIRECCIÓN:',
                                bold: true,
                                borderColor: ['#000000', '#ffffff', '#ffffff', '#ffffff'],
                            },
                            {
                                text: `${data.destinatario.direccion || '-'}`,
                                colSpan: 2,
                                borderColor: ['#ffffff', '#ffffff', '#000000', '#ffffff'],
                            },
                        ],
                        [
                            {
                                text: 'LOCALIDAD:',
                                bold: true,
                                borderColor: ['#000000', '#ffffff', '#ffffff', '#ffffff'],
                            },
                            {
                                text: `${data.destinatario.localidad || '-'}`,
                                colSpan: 2,
                                borderColor: ['#ffffff', '#ffffff', '#000000', '#ffffff'],
                            },
                        ],
                        [
                            {
                                text: 'REFERENCIA:',
                                bold: true,
                                borderColor: ['#000000', '#ffffff', '#ffffff', '#000000'],
                            },
                            {
                                text: `${data.destinatario.referencia || '-'}`,
                                colSpan: 2,
                                borderColor: ['#000000', '#ffffff', '#000000', '#000000'],
                            },
                        ],
                        [
                            {
                                text: '',
                                colSpan: 3,
                                margin: [0, 20, 0, 20],
                            },
                        ],
                        [
                            `${moment(data.paquete.fecha).format('yyyy-MM-DD') || moment().format('yyyy-MM-DD')}`,
                            { text: 'Firma Recepción', alignment: 'center' },
                            '',
                        ],
                        // ${moment().format('yyyy-MM-DD')}
                    ],
                },
            };
            paquetes.push(element);
        }

        delete paquetes[0].pageBreak;
        return paquetes;
    }

    generarPdf(data: Cargo) {
        const documentDefinition = {
            pageSize: {
                width: 393.6,
                height: 'auto',
            },
            content: this.generarTicketRuta(data),
            images: {
                barcode: this.generarCodigoBarra(data.paquete.codigo),
            },
        };

        pdfMake.createPdf(documentDefinition).open();
    }

    generarPdfCargos({ cabecera, cargos }: Data, chofer: boolean = true, rows?: boolean) {
        const documentDefinition = {
            content: [
                {
                    margin: [0, 0, 0, 10],
                    columns: [
                        [
                            {
                                text: 'SUCURSAL REMITENTE',
                                bold: true,
                            },
                            { text: `${cabecera.sucursalRemitente}` },
                        ],
                        [
                            {
                                text: 'N° MANIFIESTO',
                                bold: true,
                            },
                            { text: `${cabecera.idGuia}` },
                        ],
                    ],
                },
                {
                    margin: [0, 0, 0, 10],
                    columns: [
                        [
                            {
                                text: 'SUCURSAL DESTINO',
                                bold: true,
                            },
                            { text: `${cabecera.sucursalDestino || '-'}` },
                        ],
                        [
                            {
                                text: 'FECHA SALIDA',
                                bold: true,
                            },
                            { text: `${cabecera.fechaSalida || '-'}` },
                        ],
                    ],
                },
                {
                    margin: [0, 0, 0, 10],
                    columns: [
                        [
                            {
                                text: `${chofer ? 'CHOFER' : 'MENSAJERO'}`,
                                bold: true,
                            },
                            { text: `${cabecera.personal || '-'}` },
                        ],
                        [
                            {
                                text: 'TOTAL',
                                bold: true,
                            },
                            { text: `${cargos.length}` },
                        ],
                    ],
                },
                rows
                    ? {
                          table: {
                              headerRows: 1,
                              widths: ['auto', '*', 'auto', 'auto', 'auto'],
                              body: [
                                  [
                                      { text: 'Código Barra', bold: true },
                                      { text: 'Nombre Cliente', bold: true },
                                      { text: 'Cant Paquetes', bold: true },
                                      { text: 'Peso', bold: true },
                                      { text: 'Pago', bold: true },
                                  ],
                                  ...cargos.map((c) => [
                                      c.guiaOs,
                                      `${c.nombres} ${c.apellidos || ''}`,
                                      c.cantidadPaquetes,
                                      `${c.pesoTotal} kg`,
                                      c.pagaDestino === 1 ? 'Contraentrega' : '',
                                  ]),
                              ],
                          },
                      }
                    : null,
            ],
        };
        pdfMake.createPdf(documentDefinition).open();
    }
}

interface Data {
    cabecera: Manifiesto;
    cargos: ItemCargo[];
}

interface ItemCargo {
    nombres: string;
    apellidos: string;
    cantidadPaquetes: number;
    guiaOs: string;
    idCliente: number;
    idOrdenServicio: number;
    idServicio: number;
    pagaDestino: number;
    pesoTotal: string;
}
