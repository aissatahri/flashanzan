import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type FontFamily = 'default' | 'architects-daughter' | 'coming-soon' | 'kalam' | 'nanum-pen';

export interface FontOption {
  id: FontFamily;
  name: string;
  nameAr: string;
  nameEn: string;
  cssFamily: string;
  preview: string;
}

@Injectable({
  providedIn: 'root'
})
export class FontService {
  private readonly STORAGE_KEY = 'flashanzan_font';
  
  private currentFontSubject: BehaviorSubject<FontFamily>;
  public currentFont$: Observable<FontFamily>;

  public fontOptions: FontOption[] = [
    {
      id: 'default',
      name: 'Par défaut',
      nameAr: 'افتراضي',
      nameEn: 'Default',
      cssFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      preview: '123'
    },
    {
      id: 'architects-daughter',
      name: 'Architects Daughter',
      nameAr: 'أركيتكتس دوتر',
      nameEn: 'Architects Daughter',
      cssFamily: "'Architects Daughter', cursive",
      preview: '123'
    },
    {
      id: 'coming-soon',
      name: 'Coming Soon',
      nameAr: 'كومنج سون',
      nameEn: 'Coming Soon',
      cssFamily: "'Coming Soon', cursive",
      preview: '123'
    },
    {
      id: 'kalam',
      name: 'Kalam',
      nameAr: 'كلام',
      nameEn: 'Kalam',
      cssFamily: "'Kalam', cursive",
      preview: '123'
    },
    {
      id: 'nanum-pen',
      name: 'Nanum Pen Script',
      nameAr: 'نانوم بن سكريبت',
      nameEn: 'Nanum Pen Script',
      cssFamily: "'Nanum Pen Script', cursive",
      preview: '123'
    }
  ];

  constructor() {
    const savedFont = this.loadFont();
    this.currentFontSubject = new BehaviorSubject<FontFamily>(savedFont);
    this.currentFont$ = this.currentFontSubject.asObservable();
  }

  private loadFont(): FontFamily {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved && this.isValidFont(saved)) {
      return saved as FontFamily;
    }
    return 'default';
  }

  private isValidFont(font: string): boolean {
    return this.fontOptions.some(option => option.id === font);
  }

  getCurrentFont(): FontFamily {
    return this.currentFontSubject.value;
  }

  setFont(font: FontFamily): void {
    if (this.isValidFont(font)) {
      this.currentFontSubject.next(font);
      localStorage.setItem(this.STORAGE_KEY, font);
    }
  }

  getFontCssFamily(fontId: FontFamily): string {
    const font = this.fontOptions.find(f => f.id === fontId);
    return font ? font.cssFamily : this.fontOptions[0].cssFamily;
  }

  getFontOption(fontId: FontFamily): FontOption | undefined {
    return this.fontOptions.find(f => f.id === fontId);
  }
}
