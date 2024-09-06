import { openai } from '@ai-sdk/openai';
import { streamText, convertToCoreMessages } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 50;

export async function POST(req: Request) {
    const { messages } = await req.json();

    const content = `    Basándote en el siguiente JSON quiero que me hagas una cotización según la información que te daré a continuación que tu me vas a pedir. Me darás una tabla tabular con las columnas de producto, cantidad, precio por unidad en formato de pesos y precio total en formato de precios. El precio total será el resultado del precio por unidad x la cantidad. Incluye dentro de la tabla la suma total de todo con una leyenda que diga que ya incluye IVA. Solo imprime el total una ves.
    Devuelveme los datos en un JSON y no me esribas ningún texto de introducción, solo dame el JSON:
    formato esperado:"
{
    "Productos": [
        {
            "Producto": "",
            "Cantidad": ,
            "Precio por unidad": 1000.00,
            "Precio total": 1000.00
        },
        {
            "Producto": "",
            "Cantidad": ,
            "Precio por unidad": 1000.00,
            "Precio total": 1000.00
        }
    ],
    "Total": 2000.00
}"
    
    Este es el json de donde sacaras la información 
{
  "productos": [
    {"nombre": "Cámara bala 2 megapixeles", "precio": 638.00},
    {"nombre": "Cámara domo 2 megapixeles", "precio": 638.00},
    {"nombre": "Cámara bala 5 megapixeles", "precio": 788.80},
    {"nombre": "Cámara domo 5 megapixeles", "precio": 835.20},
    {"nombre": "Tranceptor", "precio": 139.20},
    {"nombre": "DVR 4 canales", "precio": 1276.00},
    {"nombre": "DVR 8 canales", "precio": 1856.00},
    {"nombre": "DVR 16 canales", "precio": 3074.00},
    {"nombre": "Fuente de 12 volts", "precio": 365.40},
    {"nombre": "Fuente para 8 cámaras", "precio": 1276.00},
    {"nombre": "NVR 8 megapixeles 4 canales", "precio": 1914.00},
    {"nombre": "NVR 8 megapixeles 8 canales", "precio": 3132.00},
    {"nombre": "NVR 8 megapixeles 16 canales", "precio": 3596.00},
    {"nombre": "Cámara IP bala 2 megapixeles", "precio": 1102.00},
    {"nombre": "Cámara IP bala 4 megapixeles", "precio": 1531.20},
    {"nombre": "Cámara IP bala 8 megapixeles", "precio": 2204.00},
    {"nombre": "Cámara IP domo 2 megapixeles", "precio": 1102.00},
    {"nombre": "Cámara IP domo 4 megapixeles", "precio": 1218.00},
    {"nombre": "Cámara IP domo 8 megapixeles", "precio": 2088.00},
    {"nombre": "Metro cable cat5 exterior", "precio": 17.00},
    {"nombre": "Metro cable cat5 interior", "precio": 16.00},
    {"nombre": "Metro cable cat6 exterior", "precio": 19.00},
    {"nombre": "Metro cable cat5 interior", "precio": 27.00},
    {"nombre": "Instalación cámara", "precio": 520.00},
    {"nombre": "Disco duro 1 terabyte", "precio": 1100.00},
    {"nombre": "Disco duro 2 terabyte", "precio": 1560.00}
  ]
}

]`

    const newMessages=convertToCoreMessages(messages)
    console.log("esto le mando:",messages[0].content)
    console.log("esto le mando:",messages)
    const result = await streamText({
        model: openai('gpt-4-turbo'),
        messages: [
            { role:'system',content:content},
            ...newMessages
        ],
        async onFinish({ text, toolCalls, toolResults, usage, finishReason }) {
            console.log("se terminó de escribir")
            console.log("Texto final:", text);
        },
    });

    return result.toDataStreamResponse();
}