import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any, args: any, loginToSearch: string): any {
    if (!value) {

      return null;
    }
    if (!args && !loginToSearch) {

      return value;
    }
    // args = args.toString().toLowerCase();
    loginToSearch = loginToSearch.toString().toLowerCase();
    return value.filter(data => {
      return data.login.includes(loginToSearch);
    });

  }

}
