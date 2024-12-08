"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("../config/db"));
const testConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Cargar variables de entorno
        dotenv_1.default.config();
        console.log('Intentando conectar a MongoDB...');
        // Verificar que la variable de entorno existe
        if (!process.env.DB_CONNECTION_STRING) {
            throw new Error('DB_CONNECTION_STRING no está definida en el archivo .env');
        }
        // Intentar conexión
        yield (0, db_1.default)();
        // Verificar el estado de la conexión
        const connectionState = mongoose_1.default.connection.readyState;
        console.log('\nEstado de la conexión:', getConnectionState(connectionState));
        if (connectionState === 1) {
            // Si está conectado, mostrar información adicional
            console.log('Host de la base de datos:', mongoose_1.default.connection.host);
            console.log('Nombre de la base de datos:', mongoose_1.default.connection.name);
            // Intentar una operación simple para verificar permisos
            const collections = yield mongoose_1.default.connection.db.collections();
            console.log('\nColecciones en la base de datos:');
            for (let collection of collections) {
                console.log(`- ${collection.collectionName}`);
            }
        }
    }
    catch (error) {
        console.error('❌ Error durante la prueba:', error);
    }
    finally {
        // Cerrar la conexión
        if (mongoose_1.default.connection.readyState === 1) {
            yield mongoose_1.default.connection.close();
            console.log('\nConexión cerrada correctamente');
        }
        process.exit(0);
    }
});
// Función helper para mostrar el estado de la conexión
function getConnectionState(state) {
    const states = {
        0: 'Desconectado',
        1: 'Conectado',
        2: 'Conectando',
        3: 'Desconectando'
    };
    return states[state] || 'Estado desconocido';
}
// Ejecutar el test
testConnection();
