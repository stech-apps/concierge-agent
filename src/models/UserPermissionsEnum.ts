export enum UserRole {
    None = 0,
    VisitUserRole = 1 << 0, // 01 -- the bitshift is unnecessary, but done for consistency
    AppointmentUserRole = 1 << 1,     // 10
    All = ~(~0 << 2)   // 11
  }
  