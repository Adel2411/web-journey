export function errorHandler(err,req,res,next) {
    console.error("Prisma Error:",err);
    if (err.code==='P2025') {// Prisma note not found - exmpl update/delete sur une note qui n’existe pas
        return res.status(404).json({error: 'Note not found'});
    }    
    if (err.code === 'P2002') {
    return res.status(409).json({ error: 'Duplicate entry, value must be unique' });
  }

  if (err.code === 'P2003') {
    return res.status(400).json({ error: 'Foreign key constraint failed' });
  }

  if (err.code === 'P2009') {
    return res.status(400).json({ error: 'Invalid input syntax' });
  }

  if (err.code === 'P2010') {
    return res.status(500).json({ error: 'Raw query error (check SQL syntax)' });
  }

  return res.status(500).json({
    error: 'Internal Server Error',
    detail: err.message || 'Something went wrong'
  });
}