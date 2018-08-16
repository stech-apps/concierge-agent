import { trigger, state, style, transition, animate } from '@angular/animations';

export const IDENTIFY_APPOINTMENT_ANIMATIONS = [
    trigger('slideInOut', [
      state('id', style({
        height: '42px',
      })),
      state('customer', style({
        height: '42px',
      })),
      state('duration', style({
        height: '350px',
      })),
      state('out', style({
        height: '0px',
        'padding-top': '0',
        'padding-bottom': '0'
      })),
      transition('out => customer', animate('500ms ease-in-out')),
      transition('customer => out', animate('500ms ease-in-out')),
      transition('customer => id', animate('500ms ease-in-out')),
      transition('duration => customer', animate('500ms ease-in-out')),
      transition('id => out', animate('500ms ease-in-out')),
      transition('out => id', animate('500ms ease-in-out'))
    ])
  ];