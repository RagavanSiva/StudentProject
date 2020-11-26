import { Component, OnInit } from '@angular/core';
import { StudentServiceService } from './student-service.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'StudentProject';
  post = {
    sid: '',
    name: '',
    desc: '',
    bdate: '',
    subjects: [],
  };
  pid = '';
  postList: any = [];
  filterList: any = [];
  viewList: any = [];
  btnName = 'Add';
  display = 'none';
  isEdited: boolean = false;
  searchText: '';
  selectFilter = 'select';
  selectSubject = 'select';

  constructor(private studentService: StudentServiceService) {}
  ngOnInit() {
    this.getAll();
  }

  getAll() {
    this.studentService.getAllPosts().subscribe((data) => {
      this.postList = data;
      this.filterList = data;
      this.viewList = data;
      console.log(data);
    });
  }

  getSearchData() {
    console.log('searchText', this.searchText);
    this.postList = this.postList.filter(
      (data) =>
        data.name.toLowerCase().match(this.searchText.toLowerCase()) ||
        data.desc.toLowerCase().match(this.searchText.toLowerCase())
    );
    this.viewList = this.postList;
  }

  addPost(postData) {
    console.log(postData);
    if (!this.isEdited) {
      this.studentService.createPost(postData).subscribe(
        (data) => {
          this.postList.push(data);
          alert('Sucessfully added');
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      this.UpdatePost({
        _id: this.pid,
        id: this.post.sid,
        name: this.post.name,
        desc: this.post.desc,
        bdate: this.post.bdate,
        subjects: this.post.subjects,
      });
    }
    this.filterList = this.postList;
    this.viewList = this.postList;
    this.CancelAll();
  }
  editPost(data) {
    this.post.sid = data.sid;
    this.post.name = data.name;
    this.post.desc = data.desc;
    this.post.bdate = data.bdate;
    this.post.subjects = data.subjects;
    this.pid = data._id;
    this.btnName = 'Update';
    this.display = 'inline';
    this.isEdited = true;
  }

  CancelAll() {
    this.post.sid = '';
    this.post.name = '';
    this.post.desc = '';
    this.post.bdate = '';
    this.post.subjects = [];
    this.pid = '';
    this.btnName = 'Add';
    this.display = 'none';
  }

  UpdatePost(data) {
    this.studentService.updatePost(data).subscribe((res) => {
      const tempArray = this.postList.map((result) => {
        if (data._id === result._id) {
          return {
            ...result,
            sid: data.id,
            name: data.name,
            desc: data.desc,
            bdate: data.bdate,
            subjects: data.subjects,
          };
        } else {
          return {
            ...result,
          };
        }
      });
      this.postList = tempArray;
      this.viewList = tempArray;
      this.isEdited = false;
      this.CancelAll();
    });
    alert('Sucessfully updated');
  }

  checkDataAvailability() {
    if (this.searchText === '') {
      this.getAll();
    }
  }

  filterAvailability() {
    if (this.selectFilter === 'select') {
      this.getAll();
    }

    this.viewList = this.postList.filter(
      (data) => data.name === this.selectFilter
    );
  }
  filterSubjectAvailability() {
    if (this.selectFilter === 'select') {
      this.getAll();
    }
    this.viewList = this.viewList.filter(
      (data) =>
        data.subjects[0] === this.selectSubject ||
        data.subjects[1] === this.selectSubject ||
        data.subjects[2] === this.selectSubject
    );
  }

  deletePost(data) {
    if (confirm('Do you want to delete record')) {
      this.studentService.deletePost(data._id).subscribe((res) => {
        const tempArray = this.postList.filter(
          (result) => result._id !== data._id
        );
        this.postList = tempArray;
        this.viewList = tempArray;
      });
      this.CancelAll();
      this.isEdited = false;
      this.getAll();
      this.filterList = this.postList;

      alert('record deleted sucessfully');
    }
  }
}
