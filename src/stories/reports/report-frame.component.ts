import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-report-frame',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'report-frame-host',
  },
  templateUrl: './report-frame.component.html',
  styleUrl: './report-frame.component.css',
})
export class ReportFrameComponent {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly src = input.required<string>();

  private readonly sanitizer = inject(DomSanitizer);

  readonly safeSrc = computed<SafeResourceUrl>(() =>
    this.sanitizer.bypassSecurityTrustResourceUrl(this.src()),
  );
}
