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
    $idioma = trim((string) ($data['idioma'] ?? ''));
    if (!preg_match('/^\d{8}$/', $dni) || $idioma === '') {
        throw new InvalidArgumentException('Solicitud inválida.');
    }

    $db = obtenerConexion();
    $person = $db->prepare('SELECT codmod FROM alfa1 WHERE TRIM(le) = :dni LIMIT 1');
    $person->execute(['dni' => $dni]);
    $codmod = trim((string) ($person->fetchColumn() ?: ''));
    if ($codmod === '') {
        throw new RuntimeException('Servidor no encontrado.');
    }

    $query = $db->prepare('SELECT COD_IDIO FROM alfa5 WHERE CAST(codmod AS UNSIGNED) = CAST(:codmod AS UNSIGNED) LIMIT 1');
    $query->execute(['codmod' => $codmod]);
    $current = $query->fetchColumn();
    if ($current === false) {
        throw new RuntimeException('No se encontró el registro de lengua nativa.');
    }

    $languages = array_values(array_filter(array_map('trim', explode('-', (string) $current)), static fn(string $value): bool => $value !== ''));
    $removed = false;
    $remaining = [];
    foreach ($languages as $value) {
        if (!$removed && mb_strtoupper($value, 'UTF-8') === mb_strtoupper($idioma, 'UTF-8')) {
            $removed = true;
            continue;
        }
        $remaining[] = $value;
    }
    if (!$removed) {
        throw new RuntimeException('No se encontró el idioma indicado.');
    }

    $updatedLanguages = implode('-', $remaining);
    $update = $db->prepare("UPDATE alfa5 SET COD_IDIO = :idiomas_value, NIV_IDIO = CASE WHEN :idiomas_check = '' THEN '' ELSE NIV_IDIO END WHERE CAST(codmod AS UNSIGNED) = CAST(:codmod AS UNSIGNED) LIMIT 1");
    $update->execute(['idiomas_value' => $updatedLanguages, 'idiomas_check' => $updatedLanguages, 'codmod' => $codmod]);

    echo json_encode(['ok' => true], JSON_UNESCAPED_UNICODE);
} catch (Throwable $error) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'mensaje' => $error->getMessage()], JSON_UNESCAPED_UNICODE);
}
