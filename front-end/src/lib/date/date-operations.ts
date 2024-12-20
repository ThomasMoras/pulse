export function calculateSafeAge(birthday: Date): number {
  const today = new Date();
  const calculatedAge =
    today.getFullYear() -
    birthday.getFullYear() -
    (today.getMonth() > birthday.getMonth() ||
    (today.getMonth() === birthday.getMonth() && today.getDate() >= birthday.getDate())
      ? 0
      : 1);

  return Math.min(Math.max(calculatedAge, 0), 127);
}
