import DeleteIcon from "@mui/icons-material/Delete";
import { Box, TextField, Typography, IconButton } from "@mui/material";

interface RecipeItemProps {
  id: number;
  description: string;
  onDelete: (id: number) => void;
  onDescriptionChange: (id: number, newDescription: string) => void;
  itemType: string;
}

const RecipeItem: React.FC<RecipeItemProps> = ({
  id,
  description,
  onDelete,
  onDescriptionChange,
  itemType,
}) => {
  const handleDelete = () => {
    onDelete(id);
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onDescriptionChange(id, event.target.value);
  };

  return (
    <>
      <Box display="flex" alignItems="center" mb={2}>
        <Typography variant="h6" p={2}>
          {itemType} {id}
        </Typography>
        <TextField
          value={description}
          onChange={handleDescriptionChange}
          variant="outlined"
          margin="dense"
          fullWidth
        />
        <IconButton aria-label="delete" onClick={handleDelete}>
          <DeleteIcon />
        </IconButton>
      </Box>
    </>
  );
};

export default RecipeItem;
