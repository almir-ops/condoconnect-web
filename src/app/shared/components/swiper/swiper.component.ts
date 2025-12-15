import {
  AfterViewInit,
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  Input,
  effect,
} from '@angular/core';
import { SwiperContainer } from 'swiper/element/bundle';

@Component({
  selector: 'app-swiper',
  templateUrl: './swiper.component.html',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SwiperComponent implements AfterViewInit {
  @Input() swiperContainerId = '';
  index = 0;
  slidePerView = 3;

  @ContentChild('swiper') swiperRef!: ElementRef<SwiperContainer>;
  initialized = false;

  constructor() {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      const shadowRoot = document
        .getElementById(this.swiperContainerId)
        ?.getElementsByClassName('swiper')[0]?.shadowRoot
        ?.firstChild as HTMLElement;
      shadowRoot.style.paddingBottom = '0px';
    }, 300);
  }

  changeSlide(prevOrNext: number): void {
    if (prevOrNext === -1) {
      this.swiperRef.nativeElement.swiper.slidePrev();
    } else {
      this.swiperRef.nativeElement.swiper.slideNext();
    }
  }
}
