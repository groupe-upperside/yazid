'use client';

import { useEffect, useState } from 'react';

import { useCartCustomFields, useCartItems } from '@/hooks/useSnipcart';

const DropDownRow = ({ handleRemove, handleUpdate, i }: any) => {
  const minQty = i.minQuantity ?? 1;
  const maxQty = i.maxQuantity ?? 1000;

  return (
    <div key={i.id} className="flex items-stretch gap-4 border-b border-[#707070] pb-4">
      <img src={i.image} alt={i.name} className="aspect-square size-[74px] object-cover" />
      <div className="flex w-full flex-1 flex-col justify-between py-2">
        <div className="flex w-full items-center justify-between space-x-8">
          <p className="text-sm font-bold uppercase text-black">{i.name}</p>
          <button onClick={() => handleRemove(i.uniqueId)} className="text-sm font-bold uppercase text-[#707070]">
            x
          </button>
        </div>
        <div className="flex w-full items-center justify-between space-x-8">
          <div className="flex items-center gap-2 rounded-full border border-[#707070] px-4 text-sm font-bold text-[#707070]">
            <button
              disabled={i.quantity === minQty}
              onClick={() => handleUpdate(i.uniqueId, Math.max(minQty, i.quantity - 1))}
            >
              -
            </button>
            <span>{i.quantity}</span>
            <button
              disabled={i.quantity >= maxQty}
              onClick={() => handleUpdate(i.uniqueId, Math.min(maxQty, i.quantity + 1))}
            >
              +
            </button>
          </div>
          <p className="text-sm text-[#707070]">{(i.quantity * i.price).toFixed(2).replace('.', ',')} €</p>
        </div>
      </div>
    </div>
  );
};

const CartRow = ({ handleRemove, handleUpdate, i, isCheckoutPage }: any) => {
  const minQty = i.minQuantity ?? 1;
  const maxQty = i.maxQuantity ?? 1000;

  return (
    <div
      key={i.id}
      className={`bg-[#F7F4EF] font-avenir tracking-widest ${isCheckoutPage ? '' : 'px-6 md:px-20 xl:px-32'}`}
    >
      <div
        className={`relative flex items-stretch gap-2 bg-white p-2 md:gap-4 ${isCheckoutPage ? 'md:p-4' : 'md:p-6'}`}
      >
        <button
          onClick={() => handleRemove(i.uniqueId)}
          className="absolute right-1 top-1 text-sm font-bold uppercase text-[#707070] md:right-4 md:top-4"
        >
          x
        </button>
        <div className="w-[100px] overflow-hidden rounded md:aspect-[4/3] md:w-[178px]">
          <img src={i.image} alt={i.name} className="size-full object-cover" />
        </div>
        <div
          className={`flex w-full flex-col px-2 md:flex-row md:items-center md:justify-between ${isCheckoutPage ? '' : 'md:space-x-8 md:px-6'}`}
        >
          <p className="pb-2 text-sm font-bold uppercase text-black md:pb-0">{i.name}</p>
          <div className="flex flex-col space-y-2 text-[#707070] md:flex-row md:items-center md:space-x-8 md:space-y-0">
            <div className="flex w-fit items-center gap-2 rounded-full border border-[#707070] px-2 font-bold md:gap-5 md:px-4 md:py-1">
              <button
                className="text-sm md:text-base"
                disabled={i.quantity === minQty}
                onClick={() => handleUpdate(i.uniqueId, Math.max(minQty, i.quantity - 1))}
              >
                -
              </button>
              <span className="text-sm">{i.quantity}</span>
              <button
                className="text-sm md:text-base"
                disabled={i.quantity >= maxQty}
                onClick={() => handleUpdate(i.uniqueId, Math.min(maxQty, i.quantity + 1))}
              >
                +
              </button>
            </div>
            <p className="text-sm">{(i.quantity * i.price).toFixed(2).replace('.', ',')} €</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function CartRows({ isCartPage = false, isCheckoutPage = false, lang = 'fr' }) {
  const { items, total } = useCartItems();

  const { 'Date de retrait': pickUpDate, 'Créneau horaire': timeSlot } = useCartCustomFields([
    'Date de retrait',
    'Créneau horaire',
  ]);

  const [canCheckout, setCanCheckout] = useState(false);

  useEffect(() => {
    const ready = Boolean(pickUpDate && timeSlot);
    setCanCheckout(ready);
  }, [pickUpDate, timeSlot]);

  const handleUpdate = async (uniqueId: string, quantity: number) => {
    try {
      // @ts-ignore
      await window.Snipcart.api.cart.items.update({ uniqueId, quantity });
    } catch (err) {
      console.error('Failed to update item:', err);
    }
  };

  const handleRemove = async (uniqueId: string) => {
    try {
      // @ts-ignore
      await window.Snipcart.api.cart.items.remove(uniqueId);
    } catch (err) {
      console.error('Failed to remove item:', err);
    }
  };

  if (items.length === 0 && !isCartPage && !isCheckoutPage) {
    return <p className="text-sm">{!lang?.includes('fr') ? 'Your cart is empty' : 'Votre panier est vide'}</p>;
  }

  return (
    <div className={`${isCheckoutPage ? 'pt-6' : ''} w-full space-y-4 ${isCartPage ? 'bg-[#F7F4EF]' : ''} `}>
      {items.map((i) =>
        !isCartPage && !isCheckoutPage ? (
          <DropDownRow key={i.uniqueId} handleRemove={handleRemove} handleUpdate={handleUpdate} i={i} />
        ) : (
          <CartRow
            key={i.uniqueId}
            handleRemove={handleRemove}
            handleUpdate={handleUpdate}
            i={i}
            isCheckoutPage={isCheckoutPage}
          />
        )
      )}
      {isCartPage && items.length > 0 ? (
        <div className={`bg-[#F7F4EF] font-avenir tracking-widest ${isCheckoutPage ? '' : 'px-6 md:px-20 xl:px-32'}`}>
          <div className="flex justify-between py-6 text-base font-bold uppercase">
            <div>TOTAL</div>
            <div>{total.toFixed(2).replace('.', ',')} €</div>
          </div>
          <div className="flex w-full justify-center">
            <a
              href={canCheckout ? '#/checkout' : undefined}
              onClick={(e) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                !canCheckout && e.preventDefault();
              }}
              className="mx-auto mt-8 bg-black px-8 py-4 text-center text-sm font-medium uppercase text-white 2xl:px-12"
            >
              {!lang?.includes('fr') ? 'Order' : 'Commander'}
            </a>
          </div>
        </div>
      ) : null}
    </div>
  );
}
