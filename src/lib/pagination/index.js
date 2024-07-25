const getTotalPages = (total, rowsPerPage) => {
  return total ? Math.ceil(total / rowsPerPage) : 0
}

export { getTotalPages }