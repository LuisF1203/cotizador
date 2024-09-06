'use client';

import { useChat } from 'ai/react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, CircularProgress, Typography } from '@mui/material';
import { Button } from '@mui/joy';
import { useEffect, useState } from 'react';

interface ProductoRow {
  id: number;
  Producto: string;
  Cantidad: number;
  'Precio por unidad': number;
  'Precio total': number;
}

export default function Chat() {
  const columns = [
    { field: 'Producto', headerName: 'Producto', flex: 1 },
    { field: 'Cantidad', headerName: 'Cantidad', flex: 1 },
    { field: 'Precio por unidad', headerName: 'Precio por unidad', flex: 1 },
    { field: 'Precio total', headerName: 'Precio total', flex: 1 }
  ];

  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const [rows, setRows] = useState<ProductoRow[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [loading,setLoading]=useState(false)

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage?.content) {
        try {
          const jsonData = JSON.parse(lastMessage.content);
          console.log('Datos recibidos:', jsonData);
          setLoading(false)
          if (jsonData.Productos) {
            const dataWithId: ProductoRow[] = jsonData.Productos.map((item: any, index: number) => ({
              ...item,
              id: index
            }));
            setTotal(jsonData.Total || null);
            setRows(dataWithId); 
          } else {
            console.error('La propiedad "Productos" no se encuentra en el JSON.');
          }
        } catch (error) {
          console.error('Error al parsear JSON:', error);
          setLoading(true)
        }
      }
    }
  }, [messages]);


  return (
    <Box>
      <div style={{ height: 400, width: '100%' }}>
        {loading?<CircularProgress/>: <DataGrid rows={rows} columns={columns} getRowId={(row) => row.id} />}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          placeholder="Escribe tu cotización..."
          onChange={handleInputChange}
        />
        <Button type="submit">Enviar</Button>
      </form>

      <Box mt={2}>
        {total !== null && (
          <Typography variant="h6">Total: ${loading?<CircularProgress/>:total.toFixed(2)}</Typography>
        )}
      </Box>
    </Box>
  );
}
