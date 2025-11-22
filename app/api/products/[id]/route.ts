import { NextRequest, NextResponse } from 'next/server';
import { updateProduct, deleteProduct } from '../../../../components/productsApi';

// PUT - Update product
export async function PUT(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    console.log('Extracted ID from URL:', id);
    
    const body = await request.json();
    const updatedProduct = await updateProduct(id, body);
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to update product' }, { status: 500 });
  }
}

// DELETE - Delete product
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    console.log('Extracted ID from URL for delete:', id);
    
    await deleteProduct(id);
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to delete product' }, { status: 500 });
  }
}