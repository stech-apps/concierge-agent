import { Pipe, PipeTransform } from '@angular/core';
import { IBranchViewModel } from 'src/models/IBranchViewModel';

@Pipe({
  name: 'filterBranch'
})
export class FilterBranchPipe implements PipeTransform {

  transform(branches: IBranchViewModel[], filterText?: any): any {

    if(!branches || !filterText) {
      return branches;
    }
    return branches.filter(b => b.name.toUpperCase().search(filterText.toUpperCase()) != -1);
  }

}
