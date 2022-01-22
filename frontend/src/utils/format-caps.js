export default function formatCaps(str) {
  return str.charAt(0) + str.slice(1, str.length).toLowerCase();
}
