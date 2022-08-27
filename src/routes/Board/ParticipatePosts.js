import React from "react";
import { Link } from "react-router-dom";
import '../../BoardStyle/ParticipatePosts.css';

const ParticipatePosts = ({ posts, loading }) => {
  return (
    <>
      {loading && <div> loading... </div>}
      <table className="common-table">
                  <colgroup>
                     <col width="5%" />
                     <col width="50%" />
                     <col width="*" />
                     <col width="*" />
                     <col width="*" />
                  </colgroup>
                  <thead>
                     <tr>
                        <th className="common-table-header">๋ฒํธ</th>
                        <th className="common-table-header">? ๋ช?</th>
                        <th className="common-table-header">??ฑ?</th>
                        <th className="common-table-header">??ฑ?ผ?</th>
                        <th className="common-table-header">์กฐํ?</th>
                     </tr>
                  </thead>
                  <tbody>
                     {posts.map(post => (
                        <tr className="common-table-row" key={post._id}>
                           <td className="common-table-column">{"post._id"}</td>
                           <td className="common-table-column">{post.title}</td>
                           <td className="common-table-column">{"post.userName"}</td>
                           <td className="common-table-column">{"date"}</td>
                           <td className="common-table-column">{"post.readCount"}</td>
                        </tr>
                     ))}
                  </tbody>

               </table>
    </>
  );
};
export default ParticipatePosts;