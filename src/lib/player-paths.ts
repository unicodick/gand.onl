export function playerProfilePath(username: string): string {
  return `/@${encodeURIComponent(username)}`;
}

export function playerEditPath(username: string): string {
  return `${playerProfilePath(username)}/edit`;
}
