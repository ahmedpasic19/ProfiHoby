import { useMemo, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { trpcClient } from '../../utils/api'

import Select from 'react-select'
import Spinner from '../mics/Spinner'

type TProps = {
  orderByPrice?: string
  group_id?: string
  isLoading: boolean
  brand: string
  priceFrom: number
  priceTo: number
  setOrderByPrice: React.Dispatch<React.SetStateAction<string>>
  setPriceFrom: React.Dispatch<React.SetStateAction<number>>
  setPriceTo: React.Dispatch<React.SetStateAction<number>>
  setBrand: React.Dispatch<React.SetStateAction<string>>
  refetch: () => void
}

const FilterSidebar = ({
  orderByPrice,
  group_id,
  isLoading,
  brand,
  priceFrom,
  priceTo,
  setBrand,
  setOrderByPrice,
  setPriceFrom,
  setPriceTo,
  refetch,
}: TProps) => {
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const { data: brands } = useQuery(['brand.getAllBrands'], () =>
    group_id
      ? trpcClient.brand.getBrandsByGroupId.query({ group_id })
      : trpcClient.brand.getAllBrands.query()
  )

  const brandOptions =
    brands?.map((brand) => ({
      label: brand.name,
      value: brand.id,
    })) || []
  const orderOptions = [
    { label: 'Bez filtera', value: '' },
    { label: 'Najvišoj', value: 'desc' },
    { label: 'Najnižoj', value: 'asc' },
  ]

  brandOptions.splice(0, 0, { label: 'Odaberi brend', value: '' })

  const brand_value = useMemo(
    () => brandOptions?.find((option) => option.value === brand),
    [brand]
  )
  const order_value = useMemo(
    () => orderOptions?.find((option) => option.value === orderByPrice),
    [orderByPrice]
  )

  useEffect(() => {
    setTimeout(() => {
      refetch()
      scrollToTop()
    }, 200)
  }, [orderByPrice])

  return (
    <>
      <div
        className={`flex h-full w-full flex-col justify-end bg-white px-2 pb-4 sm:sticky sm:top-[14vh] sm:flex sm:max-w-[16rem] sm:pl-2 sm:pb-0`}
      >
        <fieldset className='mb-2 flex flex-col'>
          <label htmlFor='od' className='mb-1 font-semibold'>
            Cijena OD
          </label>
          <input
            id='od'
            placeholder='Cijena OD'
            type='number'
            value={priceFrom || ''}
            onChange={(e) => setPriceFrom(parseFloat(e.target.value))}
            className='w-full rounded-sm border-2 border-gray-200 p-1 outline-none'
          />
        </fieldset>
        <fieldset className='mb-2 flex flex-col'>
          <label htmlFor='do' className='mb-1 font-semibold'>
            Cijena DO
          </label>
          <input
            id='do'
            placeholder='Cijena DO'
            type='number'
            value={priceTo || ''}
            onChange={(e) => setPriceTo(parseFloat(e.target.value))}
            className='w-full rounded-sm border-2 border-gray-200 p-1 outline-none'
          />
        </fieldset>
        <fieldset className='mb-2 flex flex-col'>
          <label htmlFor='do' className='mb-1 font-semibold'>
            Filtriraj po cijeni
          </label>
          <Select
            placeholder='Filtriraj po cijeni . . . '
            options={orderOptions}
            value={order_value || null}
            onChange={(option) => {
              if (option) {
                setOrderByPrice(option.value)
                scrollToTop()
              }
            }}
          />
        </fieldset>
        {group_id && (
          <fieldset className='mb-2 flex flex-col'>
            <label htmlFor='do' className='mb-1 font-semibold'>
              Brend
            </label>
            <Select
              placeholder='Brend . . . '
              options={brandOptions}
              value={brand_value || null}
              onChange={(option) => option && setBrand(option.value)}
            />
          </fieldset>
        )}
        <button
          onClick={() => {
            refetch()
            scrollToTop()
          }}
          className='flex w-full items-center justify-center bg-gray-800 py-2 text-lg text-white'
        >
          {isLoading ? <Spinner /> : 'Osvježi'}
        </button>
      </div>
    </>
  )
}

export default FilterSidebar
