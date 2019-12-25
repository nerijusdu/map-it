export interface IPagedResult<TItem> {
  pageCount: number;
  pageNumber: number;
  items: TItem[];
}

export interface IPagedRequest {
  pageSize?: number;
  page?: number;
}
