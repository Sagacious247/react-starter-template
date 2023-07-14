import React, { useState } from 'react'
import styles from './Pagination.module.scss'

function Pagination({totalProducts, currentPage, setCurrentPage, productsPerPage}) {

  const pageNumbers = []
  const totalPages = totalProducts / productsPerPage;
  // Limit the page nubers shown
  const [pageNumberLimit, setPageNumberLimit] = useState(5)
  const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(5)
  const [minPageNumberLimit, setMinPageNumberLimit] = useState(0)

  // Paginate
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  // Go to Next Page
  const paginateNext = () => {
    setCurrentPage(currentPage + 1)
    // Show next set of page numbers
    if(currentPage + 1 > maxPageNumberLimit) {
      setMaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit)
      setMinPageNumberLimit(minPageNumberLimit + pageNumberLimit)
    }
  }

  // Go to Previous Page
  const paginatePrev = () => {
    setCurrentPage(currentPage - 1)
    if((currentPage - 1) % pageNumberLimit == 0 ) {
      setMaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit)
      setMinPageNumberLimit(minPageNumberLimit - pageNumberLimit)
    }
  }

  for (let i = 1; 
    i <= Math.ceil(totalProducts / productsPerPage); i++) {
      pageNumbers.push(i)
    }
  return (
    <ul className={styles.pagination}>
      
      <li className={currentPage === pageNumbers[0] ? `${styles.hidden}` : null} onClick={paginatePrev}>Prev</li>

       {pageNumbers.map((number) => {
        if(number < maxPageNumberLimit + 1 && number > minPageNumberLimit) {
          return (
            <li onClick={() => paginate(number)} 
            key={number} className={currentPage === number ? `${styles.active}` : null}>
              {number}
            </li>
          )
        }
       })}
      <li onClick={paginateNext} className={currentPage === pageNumbers[pageNumbers.length - 1] ? `${styles.hidden}` : null}>Next</li>
      <p>
        <b className={styles.page}>{`page ${currentPage}`}</b>
        <span>{` of `}</span>
        <b>{`${Math.ceil(totalPages)}`}</b>
      </p>
    </ul>
  )
}

export default Pagination
