import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
    TableCell,
  } from "@/components/ui/table";
  import { MdDelete } from "react-icons/md";
  import { MdEdit } from "react-icons/md";
  
  export function TableDemo({ data, deleteHandler }) {
    return (
      <div>
{    data.length > 0 ? <div className="w-1/2 container mx-auto border-4 rounded-xl border-slate-100 bg-slate-950/50 mt-3.5">
        {/* Add height and overflow to the table container */}
        <div className="max-h-72 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Site</TableHead>
                <TableHead className="text-center">Username</TableHead>
                <TableHead className="text-right">Password</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.site}>
                  <TableCell><a target="_blank" href={item.site}>{item.site}</a></TableCell>
                  <TableCell className="text-center">{item.username}</TableCell>
                  <TableCell className="text-right">{item.password}</TableCell>
                  <TableCell>
                    <div className="flex flex-row-reverse gap-2">
                      <span>
                        <MdDelete size={20} onClick={() => deleteHandler(item.id)} />
                      </span>
                      <span>
                        <MdEdit size={20} />
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div> : <div className="container mx-auto mb-60 flex justify-center items-center mt-10">No Passwords to show !</div>}
      </div>
    );
  }
  
  