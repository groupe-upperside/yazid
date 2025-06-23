import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'Missing product id' }, { status: 400 });
  }

  const secret = process.env.SNIPCART_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ error: 'Missing SNIPCART_SECRET_KEY env' }, { status: 500 });
  }

  const authHeader = `Basic ${Buffer.from(`${secret}:`).toString('base64')}`;

  try {
    const upstream = await fetch(`https://app.snipcart.com/api/products/${id.toString()}`, {
      headers: {
        Accept: 'application/json',
        Authorization: authHeader,
      },
      cache: 'no-store',
    });

    if (!upstream.ok) {
      return NextResponse.json({ error: `Snipcart responded ${upstream.status}` }, { status: upstream.status });
    }

    const product = await upstream.json();

    return NextResponse.json({ stock: product.stock, allowOutOfStockPurchases: product.allowOutOfStockPurchases });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
