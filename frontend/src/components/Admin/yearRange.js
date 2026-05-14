/** Первый год проведения хакатона (для селектов в админке). */
const HACKATHON_FIRST_YEAR = 2022;

/**
 * Годы для селектов: с года старта хакатона по текущий календарный год, по возрастанию.
 */
export function getAdminYearOptions() {
  const current = new Date().getFullYear();
  const end = Math.max(current, HACKATHON_FIRST_YEAR);
  return Array.from({ length: end - HACKATHON_FIRST_YEAR + 1 }, (_, i) => HACKATHON_FIRST_YEAR + i);
}
