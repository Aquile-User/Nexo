const Ubicacion = require('../models/ubicacion');
const sequelize = require('../config/database');

async function testUbicacion() {
  try {
    console.log('Iniciando pruebas del módulo de ubicación...\n');

    // Test 1: Crear ubicación
    console.log('Test 1: Creando ubicación...');
    const nuevaUbicacion = await Ubicacion.create({
      codigo: `UB${Date.now()}`,  // Agregamos el código manualmente
      nombre: 'Tienda de Prueba',
      tipo_ubicacion: 'comercial',
      direccion: 'Calle Principal #123, Santo Domingo',
      coordenada: sequelize.fn('ST_GeomFromText', 'POINT(-69.931051 18.481540)'),
      provincia: 'Santo Domingo',
      municipio: 'Distrito Nacional',
      sector: 'Naco',
      referencia: 'Frente al parque',
      telefono: '+18091234567',
      email_contacto: 'tienda@prueba.com',
      horario_atencion: 'Lun-Vie 9:00-18:00'
    });
    console.log('✓ Ubicación creada exitosamente');
    console.log('ID:', nuevaUbicacion.ubicacion_id);
    console.log('Código generado:', nuevaUbicacion.codigo);

    // Test 2: Buscar ubicación
    console.log('\nTest 2: Buscando ubicación creada...');
    const ubicacionEncontrada = await Ubicacion.findByPk(nuevaUbicacion.ubicacion_id);
    console.log('✓ Ubicación encontrada:', ubicacionEncontrada.nombre);

    // Test 3: Actualizar ubicación
    console.log('\nTest 3: Actualizando ubicación...');
    await ubicacionEncontrada.update({
      nombre: 'Tienda de Prueba Actualizada',
      telefono: '+18099876543'
    });
    console.log('✓ Ubicación actualizada');

    // Test 4: Validación de email inválido
    console.log('\nTest 4: Probando validación de email...');
    try {
      await Ubicacion.create({
        nombre: 'Test Validación',
        direccion: 'Test',
        coordenada: sequelize.fn('ST_GeomFromText', 'POINT(-69.931051 18.481540)'),
        provincia: 'Test',
        municipio: 'Test',
        email_contacto: 'email_invalido'
      });
      console.log('✗ Error: La validación de email no funcionó');
    } catch (error) {
      console.log('✓ Validación de email funciona correctamente');
    }

    // Test 5: Búsqueda por coordenadas
    console.log('\nTest 5: Buscando ubicaciones cercanas...');
    const ubicacionesCercanas = await Ubicacion.findAll({
      where: sequelize.literal(`
        ST_Distance_Sphere(
          coordenada,
          ST_GeomFromText('POINT(-69.931051 18.481540)')
        ) <= 5000
      `)
    });
    console.log(`✓ Se encontraron ${ubicacionesCercanas.length} ubicaciones cercanas`);

    // Test 6: Eliminar ubicación
    console.log('\nTest 6: Eliminando ubicación de prueba...');
    await ubicacionEncontrada.destroy();
    console.log('✓ Ubicación eliminada');

    console.log('\n✅ Todas las pruebas completadas exitosamente');

  } catch (error) {
    console.error('\n❌ Error durante las pruebas:', error);
  } finally {
    // Cerrar conexión
    await sequelize.close();
  }
}

// Ejecutar pruebas
testUbicacion();