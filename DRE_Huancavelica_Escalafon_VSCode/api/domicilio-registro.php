<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
require_once __DIR__ . '/conexion.php';

try {
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'DELETE') {
        throw new RuntimeException('Método no permitido.');
    }

    $data = json_decode((string) file_get_contents('php://input'), true) ?: [];
    $dni = trim((string) ($data['dni'] ?? ''));
    if (!preg_match('/^\d{8}$/', $dni)) {
        throw new InvalidArgumentException('DNI inválido.');
    }

    $db = obtenerConexion();
    $query = $db->prepare("UPDATE alfa1 SET dom = '', DOM_NOMPREFIJO = '', DOM_UBIGEO = '' WHERE TRIM(le) = :dni LIMIT 1");
    $query->execute(['dni' => $dni]);
    if ($query->rowCount() < 1) {
        throw new RuntimeException('No se encontró un domicilio registrado para eliminar.');
    }

    echo json_encode(['ok' => true, 'mensaje' => 'Domicilio eliminado correctamente.'], JSON_UNESCAPED_UNICODE);
} catch (Throwable $error) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'mensaje' => $error->getMessage()], JSON_UNESCAPED_UNICODE);
}
