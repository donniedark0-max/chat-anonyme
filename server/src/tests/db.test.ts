import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db';

const testConnection = async () => {
  try {
    // Cargar variables de entorno
    dotenv.config();

    console.log('Intentando conectar a MongoDB...');
    
    // Verificar que la variable de entorno existe
    if (!process.env.DB_CONNECTION_STRING) {
      throw new Error('DB_CONNECTION_STRING no está definida en el archivo .env');
    }

    // Intentar conexión
    await connectDB();

    // Verificar el estado de la conexión
    const connectionState = mongoose.connection.readyState;
    console.log('\nEstado de la conexión:', getConnectionState(connectionState));

    if (connectionState === 1) {
      // Si está conectado, mostrar información adicional
      console.log('Host de la base de datos:', mongoose.connection.host);
      console.log('Nombre de la base de datos:', mongoose.connection.name);
      
      // Intentar una operación simple para verificar permisos
      const collections = await mongoose.connection.db.collections();
      console.log('\nColecciones en la base de datos:');
      for (let collection of collections) {
        console.log(`- ${collection.collectionName}`);
      }
    }

  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  } finally {
    // Cerrar la conexión
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('\nConexión cerrada correctamente');
    }
    process.exit(0);
  }
};

// Función helper para mostrar el estado de la conexión
function getConnectionState(state: number): string {
  const states: { [key: number]: string } = {
    0: 'Desconectado',
    1: 'Conectado',
    2: 'Conectando',
    3: 'Desconectando'
  };
  return states[state] || 'Estado desconocido';
}

// Ejecutar el test
testConnection();