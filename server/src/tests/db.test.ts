import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db';

const testConnection = async () => {
  try {
    // Cargar variables de entorno
    dotenv.config();

    console.log('🔄 Intentando conectar a MongoDB...');

    // Verificar que la variable de entorno existe
    if (!process.env.DB_CONNECTION_STRING) {
      throw new Error('❌ DB_CONNECTION_STRING no está definida en el archivo .env');
    }

    // Intentar conexión usando connectDB
    await connectDB();

    // Verificar el estado de la conexión
    const connectionState = mongoose.connection.readyState;
    console.log('✅ Estado de la conexión:', getConnectionState(connectionState));

    if (connectionState === 1) {
      // Mostrar información adicional de la conexión
      console.log('🔗 Host de la base de datos:', mongoose.connection.host);
      console.log('📂 Nombre de la base de datos:', mongoose.connection.name);

      // Verificar que db no sea undefined
      const db = mongoose.connection.db;
      if (!db) {
        throw new Error('❌ La conexión a la base de datos está activa, pero "db" es undefined.');
      }

      // Intentar una operación simple para verificar permisos
      const collections = await db.collections();
      if (collections.length > 0) {
        console.log('\n📂 Colecciones en la base de datos:');
        collections.forEach((collection) => {
          console.log(`- ${collection.collectionName}`);
        });
      } else {
        console.log('\n⚠️ No se encontraron colecciones en la base de datos.');
      }
    } else {
      console.log('❌ No se pudo establecer la conexión con MongoDB.');
    }
  } catch (error) {
    handleKnownError(error);
  } finally {
    // Cerrar la conexión si está abierta
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('\n✅ Conexión cerrada correctamente.');
    }
    process.exit(0);
  }
};

// Manejo de errores conocidos
const handleKnownError = (error: unknown) => {
  if (error instanceof Error) {
    console.error('❌ Error durante la prueba de conexión:', error.message);
  } else {
    console.error('❌ Error inesperado:', error);
  }
};

// Función helper para mostrar el estado de la conexión
function getConnectionState(state: number): string {
  const states: { [key: number]: string } = {
    0: 'Desconectado',
    1: 'Conectado',
    2: 'Conectando',
    3: 'Desconectando',
  };
  return states[state] || 'Estado desconocido';
}

// Ejecutar el test
testConnection();