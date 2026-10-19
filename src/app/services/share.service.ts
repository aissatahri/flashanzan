import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

export interface ShareCard {
  headline: string;   // ex. "Calcul réussi !"
  stat: string;       // ex. "10 nombres"
  detail: string;     // ex. "10–99 · 1 s"
  challenge: string;  // ex. "Et toi, tu fais mieux ?"
  message: string;    // texte accompagnant l'image
  rtl: boolean;
}

export const STORE_URL = 'https://play.google.com/store/apps/details?id=com.azmicro.app';

/**
 * Partage d'un résultat sous forme d'image (WhatsApp, réseaux sociaux...)
 */
@Injectable({
  providedIn: 'root'
})
export class ShareService {
  private readonly FILE_NAME = 'flashanzan-result.png';
  private readonly SIZE = 1080;

  /**
   * Partager le résultat. Lève une erreur si l'utilisateur annule le partage.
   */
  async shareResult(card: ShareCard): Promise<void> {
    const dataUrl = this.drawCard(card);

    if (Capacitor.isNativePlatform()) {
      const file = await Filesystem.writeFile({
        path: this.FILE_NAME,
        data: dataUrl.split(',')[1],
        directory: Directory.Cache
      });
      await Share.share({
        text: card.message,
        url: STORE_URL,
        files: [file.uri],
        dialogTitle: card.headline
      });
      return;
    }

    // Web : partage natif du navigateur si disponible, sinon téléchargement de l'image
    const blob = await (await fetch(dataUrl)).blob();
    const image = new File([blob], this.FILE_NAME, { type: 'image/png' });
    if (navigator.canShare && navigator.canShare({ files: [image] })) {
      await navigator.share({ files: [image], text: `${card.message} ${STORE_URL}` });
    } else if (navigator.share) {
      await navigator.share({ text: card.message, url: STORE_URL });
    } else {
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = this.FILE_NAME;
      link.click();
    }
  }

  private drawCard(card: ShareCard): string {
    const size = this.SIZE;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    const font = (weight: string, px: number) => `${weight} ${px}px 'Segoe UI', Roboto, 'Noto Sans Arabic', sans-serif`;

    // Fond aux couleurs de l'application
    const background = ctx.createLinearGradient(0, 0, size, size);
    background.addColorStop(0, '#667eea');
    background.addColorStop(1, '#764ba2');
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, size, size);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.direction = card.rtl ? 'rtl' : 'ltr';
    const center = size / 2;

    ctx.fillStyle = '#ffffff';
    ctx.font = font('800', 84);
    ctx.fillText('FlashAnzan', center, 130);

    // Carte blanche
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(30, 20, 80, 0.3)';
    ctx.shadowBlur = 40;
    this.roundedRect(ctx, 90, 220, size - 180, 680, 48);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.font = font('400', 120);
    ctx.fillText('🎉', center, 340);

    ctx.fillStyle = '#2c3e50';
    ctx.font = font('700', 64);
    ctx.fillText(card.headline, center, 470);

    ctx.fillStyle = '#5a4fcf';
    ctx.font = font('800', 96);
    ctx.fillText(card.stat, center, 590);

    // Ligne purement numérique : toujours de gauche à droite, même en arabe
    ctx.direction = 'ltr';
    ctx.fillStyle = '#6b7280';
    ctx.font = font('500', 48);
    ctx.fillText(card.detail, center, 680);
    ctx.direction = card.rtl ? 'rtl' : 'ltr';

    ctx.fillStyle = '#27ae60';
    ctx.font = font('700', 50);
    ctx.fillText(card.challenge, center, 800);

    ctx.direction = 'ltr';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = font('600', 38);
    ctx.fillText('▶ Google Play · FlashAnzan', center, 990);

    return canvas.toDataURL('image/png');
  }

  private roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number): void {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.arcTo(x, y + height, x, y, radius);
    ctx.arcTo(x, y, x + width, y, radius);
    ctx.closePath();
  }
}
