import { trigger, state, style, transition, animate } from '@angular/animations';

export const IDENTIFY_APPOINTMENT_ANIMATIONS = [
    trigger('slideInOut', [
      state('id', style({
        height: '42px',
      })),
      state('qr', style({
        height: '42px',
      })),
      state('customer', style({
        height: '42px',
      })),
      state('input', style({
        height: '42px',
      })),
      state('duration', style({
        height: '350px',
      })),
      state('durationWithDate', style({
        height: '515px',
      })),
      state('out', style({
        height: '0px',
        'padding-top': '0',
        'padding-bottom': '0'
      })),
      transition('out => customer', animate('500ms ease-in-out')),
      transition('customer => out', animate('500ms ease-in-out')),
      transition('duration => out', animate('500ms ease-in-out')),
      transition('durationWithDate => out', animate('500ms ease-in-out')),
      transition('customer => id', animate('500ms ease-in-out')),
      transition('duration => customer', animate('500ms ease-in-out')),
      transition('durationWithDate => customer', animate('500ms ease-in-out')),
      transition('duration => input', animate('500ms ease-in-out')),
      transition('durationWithDate => input', animate('500ms ease-in-out')),
      transition('id => out', animate('500ms ease-in-out')),
      transition('out => id', animate('500ms ease-in-out')),
      transition('qr => out', animate('500ms ease-in-out')),
      transition('out => qr', animate('500ms ease-in-out'))
    ])
  ];