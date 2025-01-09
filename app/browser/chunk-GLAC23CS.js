import{A as h,Bb as g,Sb as u,aa as s,k as n,lb as d,w as l}from"./chunk-FYHOXPUP.js";var L=(()=>{let o=class o{constructor(){this.http=h(d),this.notificationService=h(u),this.api=h(g),this.host=this.api.host,this.categories=s([]),this.categoryDialogVisible=s(!1),this.categoriesLoading=s(!1),this.selectedCategory=s(null),this.selectedCategorySell=s(null),this.sellFilteredItems=s([]),this.itemSidebarVisible=s(!1),this.products=s([]),this.filteredItems=s([]),this.tableLoading=s(!1),this.submitItemLoading=s(!1),this.first_run=!0,this.barcodeError=new n,this.itemCreated=new n,this.stockDialogVisible=s(!1),this.sellProductsLoading=s(!1),this.exchangeRate=s({rate_value:0}),this.recentRates=s([]),this.rateDialogVisible=s(!1),this.stockHistory=s([]),this.historyLoading=s(!1),this.historyDialogVisible=s(!1),this.getExchangeRate(),this.getCategories(),this.getItems()}getCategories(){this.categoriesLoading.set(!0),this.http.get(`${this.host}/stock/categories`).subscribe({next:e=>{this.categories.set(e),this.categoriesLoading.set(!1)},error:e=>{this.notificationService.handleError(e.error,"home"),this.categoriesLoading.set(!1)}})}createCategory(e){this.http.post(`${this.host}/stock/categories`,e).subscribe({next:t=>{this.categories.set([...this.categories(),t]),this.notificationService.showSuccess("Category Created Successfully!","home")},error:t=>{this.notificationService.handleError(t.error,"home")}})}sortCategories(){this.http.patch(`${this.host}/stock/categories/sort`,this.categories()).subscribe({next:e=>{this.categories.set(e),this.notificationService.showSuccess("Rows reordered successfully!","home")},error:e=>{this.notificationService.handleError(e.error,"home")}})}updateCategory(e){this.http.put(`${this.host}/stock/categories`,e).subscribe({next:t=>{this.notificationService.showSuccess("Category updated successfully!","home"),this.getCategories(),this.categoryDialogVisible.set(!1),this.selectedCategory.set(t),this.selectedCategorySell.set(null),this.sellFilteredItems.set([])},error:t=>{this.notificationService.handleError(t.error,"home")}})}deleteCategory(e){this.http.delete(`${this.host}/stock/categories/${e}`).subscribe({next:t=>{this.notificationService.showSuccess(t.message,"home"),this.getCategories(),this.selectedCategory.set(null)},error:t=>{this.notificationService.handleError(t.error,"home")}})}getItems(){this.tableLoading.set(!0),this.http.get(`${this.host}/stock/items`).subscribe({next:e=>{this.products.set(e),this.tableLoading.set(!1)},error:e=>{this.notificationService.handleError(e.error,"home"),this.tableLoading.set(!1)}})}getFilteredItems(e,t){this.sellProductsLoading.set(!0),this.http.get(`${this.host}/stock/items/${e.category_id}`).subscribe({next:i=>{t=="stock"?this.filteredItems.set(i):this.sellFilteredItems.set(i),this.sellProductsLoading.set(!1)},error:i=>{this.notificationService.handleError(i.error,"category-items"),this.sellProductsLoading.set(!1)}})}createItem(e){this.submitItemLoading.set(!0),this.http.post(`${this.host}/stock/items`,e).subscribe({next:t=>{this.itemCreated.next(),this.products.set([...this.products(),t]),this.notificationService.showSuccess("Item Created Successfully!","home")},error:t=>{t.status==400&&this.barcodeError.next(),this.notificationService.handleError(t,"home"),this.submitItemLoading.set(!1)},complete:()=>{this.submitItemLoading.set(!1),this.dt2?.reset()}})}updateItem(e){this.submitItemLoading.set(!0),this.http.put(`${this.host}/stock/items`,e).subscribe({next:t=>{this.products.update(i=>{let r=this.products().findIndex(c=>c.product_id===e.product_id);return[...i.slice(0,r),t,...i.slice(r+1)]}),this.notificationService.showSuccess("Product updated successfully!","home")},error:t=>{t.status==400&&this.barcodeError.next(),this.notificationService.handleError(t,"home"),this.submitItemLoading.set(!1)},complete:()=>{this.itemSidebarVisible.set(!1),this.submitItemLoading.set(!1)}})}deleteItem(e){this.tableLoading.set(!0),this.http.delete(`${this.host}/stock/items/${e.product_id}`).subscribe({next:t=>{this.products.update(i=>{let r=this.products().findIndex(c=>c.product_id===e.product_id);return i.splice(r,1),[...i]}),this.notificationService.showSuccess(t.message,"home"),this.tableLoading.set(!1)},error:t=>{this.notificationService.handleError(t.error,"home"),this.tableLoading.set(!1)}})}submitStock(e){this.http.post(`${this.host}/stock/correction`,e).subscribe({next:t=>{this.notificationService.showSuccess(t.message,"home"),this.getItems(),this.stockDialogVisible.set(!1)},error:t=>{this.notificationService.handleError(t.error,"home")}})}getExchangeRate(){this.http.get(`${this.host}/stock/rate`).subscribe({next:e=>{this.exchangeRate.set(e)},error:e=>{this.notificationService.handleError(e.error,"home")}})}updateExchangeRate(e){this.http.post(`${this.host}/stock/rate`,e).subscribe({next:t=>{this.notificationService.showSuccess("Rate updated successfully!","home"),this.exchangeRate.set(t),this.rateDialogVisible.set(!1)},error:t=>{this.notificationService.handleError(t.error,"home")}})}fetchStockHistory(e){this.historyLoading.set(!0),this.http.get(`${this.host}/stock/history/${e}`).subscribe({next:t=>{this.historyLoading.set(!1),this.stockHistory.set(t),this.historyDialogVisible.set(!0)},error:t=>{this.historyLoading.set(!1),this.notificationService.handleError(t.error,"home")}})}};o.\u0275fac=function(t){return new(t||o)},o.\u0275prov=l({token:o,factory:o.\u0275fac,providedIn:"root"});let a=o;return a})();export{L as a};
