<?php
/**
 * Decode .NET binary session data into an associative array.
 *
 * This parser expects the following layout:
 * - A fixed header of 20 bytes (adjust if needed).
 * - Then, for each key/value pair:
 *   - A marker byte (should be 0x00).
 *   - A 1-byte key length.
 *   - The key (ASCII) of that length.
 *   - 4 bytes (big-endian) representing the value length.
 *   - The value (ASCII) of that length.
 *
 * Example data:
 * "\x02\x00\x00\x03=l\xbc\xc2E\xa7\xbd\xb3\xba\xe4\\\x1c+$\xd1\xd3\x00\x06UserId\x00\x00\x00\x011\x00\tUserEmail\x00\x00\x00\x11admin@example.com\x00\bUserRole\x00\x00\x00\x05Admin"
 *
 * @param string $data The binary session data.
 * @return array The decoded key/value pairs.
 */
function decodeDotNetSessionData(string $data): array {
    $result = [];
    $offset = 0;
    $dataLength = strlen($data);
    
    // Updated header length to 20 bytes (as determined from the sample)
    $headerLength = 20;
    if ($dataLength < $headerLength) {
        return $result;
    }
    $offset += $headerLength;
    
    while ($offset < $dataLength) {
        // Expect a marker byte (should be "\x00")
        if ($data[$offset] !== "\x00") {
            break;
        }
        $offset++; // Skip marker
        
        // Read the 1-byte key length.
        if ($offset >= $dataLength) break;
        $keyLen = ord($data[$offset]);
        $offset++;
        
        // Extract the key.
        if (($offset + $keyLen) > $dataLength) break;
        $key = substr($data, $offset, $keyLen);
        $offset += $keyLen;
        
        // Read next 4 bytes as the value length (big-endian).
        if (($offset + 4) > $dataLength) break;
        $valueLenData = substr($data, $offset, 4);
        $unpacked = unpack('N', $valueLenData);
        $valueLen = $unpacked[1];
        $offset += 4;
        
        // Extract the value.
        if (($offset + $valueLen) > $dataLength) break;
        $value = substr($data, $offset, $valueLen);
        $offset += $valueLen;
        
        $result[$key] = $value;
    }
    
    return $result;
}

// Sample binary session data (from your example)
$binarySessionData = "\x02\x00\x00\x03=l\xbc\xc2E\xa7\xbd\xb3\xba\xe4\\\x1c+$\xd1\xd3\x00\x06UserId\x00\x00\x00\x011\x00\tUserEmail\x00\x00\x00\x11admin@example.com\x00\bUserRole\x00\x00\x00\x05Admin";

$decoded = decodeDotNetSessionData($binarySessionData);
print_r($decoded);
