import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
const secrets = require('../secrets.json');

@Injectable()
export class AppService {
  constructor(private httpService: HttpService) {}

  async fetchData(id: string): Promise<any> {
    console.log(
      '<--------------------------------Server Started-------------------------------->',
    );

    // Decode base64 string from query params (id) -------------------------------->
    const jsonData = JSON.parse(Buffer.from(id, 'base64').toString('utf-8'));
    const issueId = jsonData.issueId;
    const numbers = jsonData.similarITOPS
      .split(/\D+/)
      .filter((num) => num !== '')
      .map((num) => parseInt(num));

    const apiUrl = `https://sprinklr.atlassian.net/rest/api/2/issue/${issueId}`; // Replace with your API URL
    const config = {
      headers: {
        Authorization: `Basic ${secrets.APITOKEN}`,
      },
    };

    // Fetch JIRA response related to the provided issue id  ---------------------------------------------------------------->
    const reqData = this.httpService.get(apiUrl, config).toPromise();
    console.log(
      '<--------------------------------Fetched JIRA DATA-------------------------------->',
    );
    console.log(reqData);

    
    const response = {
      summary: (await reqData).data.fields.summary,
      description: (await reqData).data.fields.description,
      comments: [],
      created: (await reqData).data.fields.created,
      updated: (await reqData).data.fields.updated,
      status: (await reqData).data.fields.status.statusCategory.name,
      chatGPT: '',
      linkedIssues: [],
    };

    // Mapping to map i.e. [_accountid:e34.....] to author display name -------------------------------->
    const mappAccountId = {};

    const commentsArray = (await reqData).data.fields.comment.comments;

    // Push comments to the response.linkedIssues array -------------------------------->
    for (let index = 0; index < commentsArray.length; index++) {
      mappAccountId['~accountid:' + commentsArray[index].author.accountId] =
        commentsArray[index].author.displayName;
    }
    for (let index = 0; index < commentsArray.length; index++) {
      const formattedBody = commentsArray[index].body.replace(
        /\[.*?\]/,
        mappAccountId['~accountid:' + commentsArray[index].author.accountId],
      );
      response.comments.push({
        authorDisplayName: commentsArray[index].author.displayName,
        authorEmailAddress: commentsArray[index].author.emailAddress,
        created: commentsArray[index].created,
        updated: commentsArray[index].updated,
        body: formattedBody,
      });
    }

    // Fetch info about each ITOPS ticket {summary, description} ---------------------------------------------------------------->

    for (let index = 0; index < numbers.length; index++) {
      const APIURL = `https://sprinklr.atlassian.net/rest/api/2/issue/${numbers[index]}`; // Replace with your API URL

      const requestData = this.httpService.get(APIURL, config).toPromise();
      console.log(requestData);
      const linkedIssuesData = {
        issueId: numbers[index],
        summary: (await requestData).data.fields.summary,
        description: (await requestData).data.fields.description,
      };
      response.linkedIssues.push(linkedIssuesData);
    }

    return response;
  }
}
