export function playerProfilePath(username: string): string {
  return `/@${encodeURIComponent(username)}`;
}
