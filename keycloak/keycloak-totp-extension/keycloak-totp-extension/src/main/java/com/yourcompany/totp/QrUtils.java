package com.yourcompany.totp;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.util.Base64;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;

public class QrUtils {
  public static String toBase64Png(String uri) {
    try {
      BitMatrix m = new QRCodeWriter().encode(uri, BarcodeFormat.QR_CODE, 200, 200);
      BufferedImage img = MatrixToImageWriter.toBufferedImage(m);
      ByteArrayOutputStream baos = new ByteArrayOutputStream();
      javax.imageio.ImageIO.write(img, "png", baos);
      return "data:image/png;base64," + Base64.getEncoder().encodeToString(baos.toByteArray());
    } catch (Exception e) {
      throw new RuntimeException(e);
    }
  }
}
